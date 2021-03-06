package com.x.mind.assemble.control.jaxrs.mind;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.x.base.core.project.bean.WrapCopier;
import com.x.base.core.project.bean.WrapCopierFactory;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.mind.assemble.control.jaxrs.exception.ExceptionMindNotExists;
import com.x.mind.assemble.control.jaxrs.exception.ExceptionMindQuery;
import com.x.mind.assemble.control.jaxrs.exception.ExceptionMindWrapOutConvert;
import com.x.mind.entity.MindBaseInfo;

/**
 * 查询脑图信息（下一步）
 * @author O2LEE
 *
 */
public class ActionMindGetWithId extends BaseAction {
	
	private Logger logger = LoggerFactory.getLogger( ActionMindGetWithId.class );
	
	protected ActionResult<Wo> execute( HttpServletRequest request, String id, EffectivePerson effectivePerson ) {
		ActionResult<Wo> result = new ActionResult<>();
		Wo wo = null;
		MindBaseInfo mindBaseInfo = null;
		Boolean check = true;

		if( check ){
			try {
				mindBaseInfo = mindInfoService.getMindBaseInfo(id);
				if( mindBaseInfo == null ) {
					check = false;
					Exception exception = new ExceptionMindNotExists( id );
					result.error(exception);
				}
			}catch( Exception e ) {
				check = false;
				Exception exception = new ExceptionMindQuery( e, "系统在根据ID查询指定的脑图信息时发生异常。" );
				result.error(exception);
				logger.error(e, effectivePerson, request, null);
			}
		}
		
		if( check ){
			try {
				wo = Wo.copier.copy(mindBaseInfo);
			} catch (Exception e) {
				check = false;
				Exception exception = new ExceptionMindWrapOutConvert( e, "将数据库实体对象转换为输出对象时发生异常！" );
				result.error(exception);
				logger.error(e, effectivePerson, request, null);
			}
		}
		result.setData(wo);
		return result;
	}
	
	public static class Wo extends MindBaseInfo  {		
		private static final long serialVersionUID = -5076990764713538973L;
		public static List<String> Excludes = new ArrayList<String>();
		public static WrapCopier<MindBaseInfo, Wo> copier = WrapCopierFactory.wo( MindBaseInfo.class, Wo.class, null,Wo.Excludes);
	}
}